const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    fname : {
        type : String,
        required : [true, 'Please specify the first name']
    },
    lname : {
        type : String,
        required : [true, 'Please specify the last name']
    },
    email : {
        type : String,
        required : [true, 'Please add a email'],
        unique : true,
        match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
        ]
    },
    password : {
        type: String,
        required : [true, 'Please add a password'],
        minlength : 6,
        select: false
    },
    role : {
        type: String,
        enum : ['user', 'manager'],
        default : 'user'
    },

    resetPasswordToken : String,
    resetPasswordExpire : Date,

}, {
    toJSON : { virtuals : true },
    toObject: { virtuals : true},
    timestamps : true
})

userSchema.virtual('houses', {
    ref : 'House',
    localField : '_id',
    foreignField : 'manager'
})

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})


userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id : this._id }, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRE
    })
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await mongoose.model('User', userSchema).findOne({email}).select('+password');

    if(!user){
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error("Unable to login");
    }

    return user
}

userSchema.methods.getResetPasswordToken = function () {

    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    console.log(resetToken)

    return resetToken;
}

module.exports =  mongoose.model('User', userSchema);