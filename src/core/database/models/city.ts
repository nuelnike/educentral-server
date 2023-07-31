const Sequelize = require('sequelize') 
export const ModelBuilder = () => { 
	const tbl:string = "cities";
	const structure:any = {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		state_id: {
			type: Sequelize.INTEGER,
			allowNull: true, 
		},
		name: {
			type: Sequelize.STRING
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
		tableName: 'cities',
		name: {
			singular: 'city',
			plural: 'cities'		
		},
		freezeTableName: true
	}
	return {tbl, structure, spec};
};