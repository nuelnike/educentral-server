const Sequelize = require('sequelize')
export const ModelBuilder = () => { 
	const tbl:string = "package";
	const structure:any = {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		cost: {
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
		tableName: 'package',
		name: {
			singular: 'package',
			plural: 'packages'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}