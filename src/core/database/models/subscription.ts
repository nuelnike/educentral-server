const Sequelize = require('sequelize')
export const ModelBuilder = () => { 
	const tbl:string = "subscriptions";
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
		payment_id: {
			type: Sequelize.STRING,
			allowNull: false,
		}, 
		package_id: {
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
		tableName: 'subscriptions',
		name: {
			singular: 'subscription',
			plural: 'subscriptions'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}