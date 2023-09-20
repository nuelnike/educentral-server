//import model builder
const { SelectModel } = require("./model-builder"); 

//MODELS LISTING
const Account = SelectModel("account");
const Status = SelectModel("status");
const Session = SelectModel("session");
const Country = SelectModel("country");
const State = SelectModel("state");
const City = SelectModel("city");
const Review =  SelectModel("review");
const Message =  SelectModel("message");
const MessageTrail =  SelectModel("message_trail");
const Listing =  SelectModel("listing");
const ListingType = SelectModel("listing_type");
const Category = SelectModel("category");
const School = SelectModel("school");
const Gallery = SelectModel("gallery");
const SchoolCategory = SelectModel("school_category");
const Payment = SelectModel("payment");
const Subscription = SelectModel("subscription");
const Package = SelectModel("package");
const Package_tiers = SelectModel("package_tiers");

const Professional = SelectModel("professional");
const Skill = SelectModel("skill");
const ProfessionalSkill = SelectModel("professional_skill");

const Comments = SelectModel("comment");
const Blog = SelectModel("blog");


Account.hasMany(Blog, { foreignKey: "account_id" });
Blog.belongsTo(Account, { foreignKey: "account_id" });

Status.hasMany(Blog, { foreignKey: "status_id" });
Blog.belongsTo(Status, { foreignKey: "status_id" });

Account.hasMany(Comments, { foreignKey: "account_id" });
Comments.belongsTo(Account, { foreignKey: "account_id" });

Account.hasOne(Professional, { foreignKey: "account_id" });
Professional.belongsTo(Account, { foreignKey: "account_id" });


Professional.hasMany(ProfessionalSkill, { foreignKey: "professional_id" });
ProfessionalSkill.belongsTo(Professional, { foreignKey: "professional_id" });

Skill.hasMany(ProfessionalSkill, { foreignKey: "skill_id" });
ProfessionalSkill.belongsTo(Skill, { foreignKey: "skill_id" });



Account.hasMany(Payment, { foreignKey: "account_id" });
Payment.belongsTo(Account, { foreignKey: "account_id" });

Account.hasMany(Subscription, { foreignKey: "account_id" });
Subscription.belongsTo(Account, { foreignKey: "account_id" });

Payment.hasMany(Subscription, { foreignKey: "payment_id" });
Subscription.belongsTo(Payment, { foreignKey: "payment_id" });

Status.hasMany(Subscription, { foreignKey: "status_id" });
Subscription.belongsTo(Status, { foreignKey: "status_id" });

Package.hasMany(Subscription, { foreignKey: "package_id" });
Subscription.belongsTo(Package, { foreignKey: "package_id" });

Package.hasMany(Package_tiers, { foreignKey: "package_id" });
Package_tiers.belongsTo(Package, { foreignKey: "package_id" });


//USER MODEL ASSOCIATION
Account.hasMany(Session, { foreignKey: "account_id" });
Account.belongsTo(Status, { foreignKey: "status_id" });
Account.hasMany(Listing, { foreignKey: "account_id" });
Account.hasMany(MessageTrail, { foreignKey: "sender" });
Country.hasMany(Account, { foreignKey: "country_id" });
Account.belongsTo(Country, { foreignKey: "country_id" });
State.hasMany(Account, { foreignKey: "state_id" });
Account.belongsTo(State, { foreignKey: "state_id" });
City.hasMany(Account, { foreignKey: "city_id" });
Account.belongsTo(City, { foreignKey: "city_id" });
Account.hasMany(Gallery, { foreignKey: "account_id" });
Gallery.belongsTo(Account, { foreignKey: "account_id" });

//MESSAGE MODEL ASSOCIATION
Message.hasMany(MessageTrail, { foreignKey: "message_id" });
Message.belongsTo(Account, { foreignKey: "sender", as: "from" }); 
Message.belongsTo(Account, { foreignKey: "receiver", as: "to" });
MessageTrail.belongsTo(Message, { foreignKey: "message_id"});
MessageTrail.belongsTo(Account, { foreignKey: "sender"});

//LISTING MODEL ASSOCIATION
Listing.belongsTo(Account, { foreignKey: "account_id"});
Listing.belongsTo(ListingType, { foreignKey: "listing_type_id"});
Listing.belongsTo(Status, { foreignKey: "status_id"});
ListingType.hasMany(Listing, { foreignKey: "listing_type_id" });

//SESSION MODEL ASSOCIATION
Session.belongsTo(Status, { foreignKey: "status_id" });
Session.belongsTo(Account, { foreignKey: "account_id" });

//STATUS MODEL ASSOCIATION
Status.hasMany(Account, { foreignKey: "status_id" });  
Status.hasMany(Session, { foreignKey: "status_id" });
Status.hasMany(Listing, { foreignKey: "status_id" });

//GEO MODEL ASSOCIATION
Country.hasMany(State, { foreignKey: "country_id" });
State.belongsTo(Country, { foreignKey: "country_id" });
State.hasMany(City, { foreignKey: "state_id" });
City.belongsTo(State, { foreignKey: "state_id" });

//INSTITUTION MODEL ASSOCIATIONS
SchoolCategory.belongsTo(School, { foreignKey: "school_id" });
School.hasMany(SchoolCategory, { foreignKey: "school_id" });

Category.hasMany(SchoolCategory, { foreignKey: "category_id" });
SchoolCategory.belongsTo(Category, { foreignKey: "category_id" });

Account.hasOne(School, { foreignKey: "account_id" });
School.belongsTo(Account, { foreignKey: "account_id" });

//EXPORT MODELS
module.exports = {
	Session, 
	Status, 
	Account,
	Country,
	State,
	City,
	Review,
	Message,
	MessageTrail,
	Listing,
	ListingType,
	Category,
	School,
	Gallery,
	SchoolCategory,
	Payment,
	Subscription,
	Package_tiers,
	Package,
	ProfessionalSkill,
	Professional,
	Skill,
	Comments,
	Blog
}