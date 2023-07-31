const Sequelize = require('sequelize') 
export const ModelBuilder = () => { 
	const tbl:string = "professionals";
	const structure:any = {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		account_id: {
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
		tableName: 'professionals',
		name: {
			singular: 'professional',
			plural: 'professionals'		
		},
		freezeTableName: true
	}
	return {tbl, structure, spec};
};