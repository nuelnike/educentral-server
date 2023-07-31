const Sequelize = require('sequelize') 
export const ModelBuilder = () => { 
	const tbl:string = "listing_types";
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
		tableName: 'listing_types',
		name: {
			singular: 'listing_type',
			plural: 'listing_types'		
		},
		freezeTableName: true
	}
	return {tbl, structure, spec};
};