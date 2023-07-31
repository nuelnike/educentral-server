const Sequelize = require('sequelize')
export const ModelBuilder = () => { 
	const tbl:string = "schools";
	const structure:any = {
		id: {
			type: Sequelize.STRING,
			primaryKey: true
		},
		account_id: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		reg_date: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		reg_code: {
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
		tableName: 'schools',
		name: {
			singular: 'school',
			plural: 'schools'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}