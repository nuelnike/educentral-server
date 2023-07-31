const Sequelize = require('sequelize')
export const ModelBuilder = () => { 
	const tbl:string = "messages";
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
		receiver: {
			type: Sequelize.STRING,
		},
		sender: {
			type: Sequelize.STRING,
		},
		subject: {
			type: Sequelize.STRING,
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
		tableName: 'messages',
		name: {
			singular: 'message',
			plural: 'messages'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}