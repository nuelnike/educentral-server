const Sequelize = require('sequelize')
export const ModelBuilder = () => { 
	const tbl:string = "sessions";
	const structure:any = {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		}, 
		account_id: {
			type: Sequelize.STRING,
		},
		status_id: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		token: {
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
		tableName: 'sessions',
		name: {
			singular: 'session',
			plural: 'sessions'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}