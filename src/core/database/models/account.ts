const Sequelize = require('sequelize') 
export const ModelBuilder = () => { 
	const tbl:string = "accounts";
	const structure:any = {
		id: {
			type: Sequelize.STRING,
			primaryKey: true,
			allowNull: false
		},
		status_id: {
			type: Sequelize.INTEGER,
			allowNull: true, 
		},    
		city_id: {
			type: Sequelize.INTEGER,
			allowNull: true, 
		},
		state_id: {
			type: Sequelize.INTEGER,
			allowNull: true, 
		},
		country_id: {
			type: Sequelize.INTEGER,
			allowNull: true, 
		},  
		username: {
			type: Sequelize.STRING,
			uniqueKey: true
		}, 
		fullname: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		acct_typ: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		email: {
			type: Sequelize.STRING,
			uniqueKey: true
		},
		phone: {
			type: Sequelize.STRING
		},
		password: {
			type: Sequelize.STRING
		},
		photo: {
			type: Sequelize.STRING
		},
		intro_video: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		address: {
			type: Sequelize.STRING
		},
		about: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		gender: {
			type: Sequelize.STRING
		},
		dob: {
			type: Sequelize.STRING
		},
		ratings: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		created_at: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW
		},
		updated_at: {
			type: Sequelize.DATE,
			// defaultValue: Sequelize.NOW
		}
	};
	const spec:any = {
		underscored: true,
		tableName: 'accounts',
		name: {
			singular: 'account',
			plural: 'accounts'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
};