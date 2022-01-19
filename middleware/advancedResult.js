
const advancedResult = (model, ressource) => async (req, res, next) => {

    let query;

    // Copy req.query
    const reqQuery = { ...req.query };
    const { headers : { host } } = req;

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = JSON.parse(queryStr);

    // Pagination
    const page        = parseInt(req.query.page, 10) || 1;
    const limit       = parseInt(req.query.limit, 10) || 6; 
    const startIndex  = (page - 1) * limit;
    const endIndex    = page * limit;
    const total       = await model.countDocuments();

    // Pagination result
    const pagination = {}

    if(endIndex < total){
        pagination.next = {
            page : page + 1,
            limit,
            link : `http://${host}/api/v1/${ressource}?limit=${limit}&page=${page+1}` 
        }
    }
    if(startIndex > 0) {
        pagination.previous = {
            page : page - 1,
            limit,
            link : `http://${host}/api/v1/${ressource}?limit=${limit}&page=${page-1}`
        }
    }

    res.data = {
        startIndex,
        endIndex,
        limit,
        pagination,
        query
    }

    next();
}

module.exports = advancedResult