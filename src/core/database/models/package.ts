import { INTEGER, STRING, DATE, NOW } from 'sequelize';
export const ModelBuilder = () => { 
	const tbl:string = "package";
	const structure:any = {
		id: {
			type: INTEGER,
			primaryKey: true,
		},
		name: {
			type: STRING,
			allowNull: false,
		},
		description: {
			type: STRING,
			allowNull: false,
		},
		created_at: {
			type: DATE,
			defaultValue: NOW
		},
		updated_at: {
			type: DATE,
			defaultValue: NOW
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