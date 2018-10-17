/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  const Pegawai = sequelize.define('Pegawai', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    badgenumber: {
      type: DataTypes.INTEGER(255),
      allowNull: true,
      unique: true
    },
    NIP: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_instansi: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    bagian: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    jabatan: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    jabatan_fungsi: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    jabatan_free_text: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    jenis_kelamin: {
      type: DataTypes.ENUM('P','W'),
      allowNull: true
    },
    gelar_depan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gelar_belakang: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_transaksi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    kode_kelas_jabatan: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    nip_atasan: {
      type: DataTypes.STRING(18),
      allowNull: true
    },
    jenis_pegawai: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    flag_aktif: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    id_jadwal_absen: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    golongan: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    no_rekening: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    npwp: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tgl_masuk: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    modified_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    modified_by: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    suprema_user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'fo_pegawai',
    timestamps: false,
  });

  Pegawai.associate = (models) => {

  };

  return Pegawai;
};
