const Sequelize = require('sequelize') 
export const ModelBuilder = () => { 
	const tbl:string = "countries";
	const structure:any = {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		sortName: {
			type: Sequelize.STRING
		},
		name: {
			type: Sequelize.STRING
		},
		phoneCode: {
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
		tableName: 'countries',
		name: {
			singular: 'country',
			plural: 'countries'		
		},
		freezeTableName: true
	}
	return {tbl, structure, spec};
};