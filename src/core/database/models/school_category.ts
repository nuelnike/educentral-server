const Sequelize = require('sequelize')
export const ModelBuilder = () => { 
	const tbl:string = "school_categories";
	const structure:any = {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		school_id: {
			type: Sequelize.STRING,
			primaryKey: true,
		},
		category_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
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
		tableName: 'school_categories',
		name: {
			singular: 'school_category',
			plural: 'school_categories'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}