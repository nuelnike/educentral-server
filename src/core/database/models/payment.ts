const Sequelize = require('sequelize')
export const ModelBuilder = () => { 
	const tbl:string = "payments";
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
		payment_ref: {
			type: Sequelize.STRING,
			allowNull: false,
		}, 
		amount: {
			type: Sequelize.STRING,
			allowNull: false,
		}, 
		channel: {
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
		tableName: 'payments',
		name: {
			singular: 'payment',
			plural: 'payments'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}