const Sequelize = require('sequelize') 
export const ModelBuilder = () => { 
	const tbl:string = "skills";
	const structure:any = {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		status_id: {
			type: Sequelize.INTEGER,
			allowNull: true, 
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
		tableName: 'skills',
		name: {
			singular: 'skill',
			plural: 'skills'		
		},
		freezeTableName: true
	}
	return {tbl, structure, spec};
};