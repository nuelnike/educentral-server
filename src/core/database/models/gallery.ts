const Sequelize = require('sequelize')
export const ModelBuilder = () => { 
	const tbl:string = "gallery";
	const structure:any = {
		id: {
			type: Sequelize.STRING,
			primaryKey: true
		},
		account_id: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		ref_link: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		file_type: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		created_at: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW
		},
		updated_at: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW
		}
	};
	const spec:any = {
		underscored: true,
		tableName: 'gallery',
		name: {
			singular: 'gallery',
			plural: 'galleries'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}