const Joi=require("joi");

const signupValidation=(req,res,next)=>{
    const schema=Joi.object({
        username:Joi.string().min(3).max(30).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(6).required(),
    });
    const {error}=schema.validate(req.body)
    if(error) {
        console.error('Signup Validation Error:', error);
        return res.status(400).json({error:error.details[0].message})
    }
    next()
}

const loginValidation=(req,res,next)=>{
    const schema=Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(6).required(),
    });
    const {error}=schema.validate(req.body)
    if(error) {
        console.error('Login Validation Error:', error);
        return res.status(400).json({error:error.details[0].message})
    }
    next()
}

const updateBioValidation = (req, res, next) => {
    const schema = Joi.object({
        email:Joi.string().email().required(),  
        bio: Joi.string().max(100).optional()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        console.error('Update Bio Validation Error:', error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

const updateUsernameValidation = (req, res, next) => {
    const schema = Joi.object({
        email:Joi.string().email().required(),  
        username:Joi.string().min(3).max(30).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        console.error('Update Username Validation Error:', error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

module.exports={signupValidation,loginValidation,updateBioValidation,updateUsernameValidation}
