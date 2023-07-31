const Sequelize = require('sequelize')
export const ModelBuilder = () => { 
	const tbl:string = "tags";
	const structure:any = {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
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
		tableName: 'tags',
		name: {
			singular: 'tag',
			plural: 'tags'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}