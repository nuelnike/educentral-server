const Sequelize = require('sequelize')
export const ModelBuilder = () => { 
	const tbl:string = "comments";
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
		ref_id: {
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
		tableName: 'comments',
		name: {
			singular: 'comment',
			plural: 'comments'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}