import { INTEGER, STRING, DATE, NOW } from 'sequelize';
export const ModelBuilder = () => { 
	const tbl:string = "package_tiers";
	const structure:any = {
		id: {
			type: INTEGER,
			primaryKey: true,
		}, 
		package_id: {
			type: STRING,
		},
		status_id: {
			type: INTEGER,
			allowNull: true,
		},
		name: {
			type: STRING,
			allowNull: false,
		}, 
		amount: {
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
		tableName: 'package_tiers',
		name: {
			singular: 'package_tier',
			plural: 'package_tiers'		
		},
		freezeTableName: true
	};
	return {tbl, structure, spec};
}