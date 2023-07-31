const Sequelize = require('sequelize')
export const ModelBuilder = () => { 
	const tbl:string = "blog";
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
		status_id: {
			type: Sequelize.INTEGER,
			allowNull: true, 
		},
		title: {
			type: Sequelize.STRING,
			allowNull: false, 
		},
		tags: {
			type: Sequelize.STRING,
			allowNull: false, 
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
		tableName: 'blog',
		name: {
			singular: 'blog',
			plural: 'blogs'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}