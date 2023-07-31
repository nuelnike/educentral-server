const Sequelize = require('sequelize')
export const ModelBuilder = () => { 
	const tbl:string = "message_trail";
	const structure:any = {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		sender: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		message_id: {
			type: Sequelize.INTEGER,
		},
		content: {
			type: Sequelize.STRING,
			allowNull: false, 
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
		tableName: 'message_trail',
		name: {
			singular: 'message_trail',
			plural: 'message_trails'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}