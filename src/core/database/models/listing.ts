const Sequelize = require('sequelize')
export const ModelBuilder = () => { 
	const tbl:string = "listings";
	const structure:any = {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		account_id: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		listing_type_id: {
			type: Sequelize.INTEGER,
			allowNull: true, 
		},
		status_id: {
			type: Sequelize.INTEGER,
			allowNull: true, 
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false, 
		},
		image: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		description: {
			type: Sequelize.STRING,
			allowNull: false, 
		},
		discount: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		price: {
			type: Sequelize.STRING,
			allowNull: false, 
		},
		stock: {
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
		tableName: 'listings',
		name: {
			singular: 'listing',
			plural: 'listings'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}