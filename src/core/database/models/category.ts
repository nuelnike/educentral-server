const Sequelize = require('sequelize') 
export const ModelBuilder = () => { 
	const tbl:string = "categories";
	const structure:any = {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: Sequelize.STRING
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
		tableName: 'categories',
		name: {
			singular: 'category',
			plural: 'categories'		
		},
		freezeTableName: true
	}
	return {tbl, structure, spec};
};