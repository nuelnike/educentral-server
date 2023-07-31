const Sequelize = require('sequelize') 
export const ModelBuilder = () => { 
	const tbl:string = "professional_skills";
	const structure:any = {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		professional_id: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		skill_id: {
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
		tableName: 'professional_skills',
		name: {
			singular: 'professional_skill',
			plural: 'professional_skills'		
		},
		freezeTableName: true
	}
	return {tbl, structure, spec};
};