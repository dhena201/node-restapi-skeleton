const model = require('../../models');
const Pegawai = model.Pegawai;
    
let getAll = (req, res, next) => {
    Pegawai.findAll({}).then(data => {
        console.info('Execute DB operation Sequelize:Pegawai.findAll()');
        res.status(200).send({message : 'Endpoint Pegawai', obj: data});
    }).catch(err => {
        next(err);
    });
};

    
module.exports = {
    getAll: getAll
};