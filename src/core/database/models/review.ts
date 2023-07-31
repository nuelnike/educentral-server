const Sequelize = require('sequelize')
export const ModelBuilder = () => { 
	const tbl:string = "reviews";
	const structure:any = {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		ref_id: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		reviewer: {
			type: Sequelize.STRING,
		},
		rating: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		content: {
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
		tableName: 'reviews',
		name: {
			singular: 'review',
			plural: 'reviews'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}