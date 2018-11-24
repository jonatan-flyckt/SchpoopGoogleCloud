import { getRepository, getConnection } from "typeorm";
import connectToDB from "./dbConnection";
import * as entities from "./entities/index";

const mockTemplates = [
	new entities.MemeTemplate(
		"zimonitrome",
		"https://i.kym-cdn.com/entries/icons/mobile/000/026/913/excuse.jpg",
		"excuse me wtf"
	)
];
const mockMemes = [
	new entities.Meme(
		0,
		"zimonitrome",
		"https://i.kym-cdn.com/photos/images/newsfeed/001/401/090/3e6.jpg"
	),
	new entities.Meme(
		0,
		"Voldemorph",
		"https://i.kym-cdn.com/photos/images/newsfeed/001/401/090/3e6.jpg"
	)
];
const mockUsers = [
	new entities.User("zimonitrome", "hunter22", "salt123"),
	new entities.User("Voldemorph", "i<3lenin", "salt321")
];
const mockComments = [
	new entities.Comment(0, "Voldemorph", "This meme was gay"),
	new entities.Comment(0, "zimonitrome", "u mom gay", 0)
];
const mockVotes = [
	new entities.Vote(1, 0, "zimonitrome"),
	new entities.Vote(1, 0, "Voldemorph"),
	new entities.Vote(-1, 1, "zimonitrome")
];

connectToDB()
	.then(() => getConnection().synchronize(true))
	.then(() => {
		const memeRepo = getRepository(entities.Meme);
		memeRepo.insert(mockMemes);
		const templateRepo = getRepository(entities.MemeTemplate);
		templateRepo.insert(mockTemplates);
		const userRepo = getRepository(entities.User);
		userRepo.insert(mockUsers);
		const commentRepo = getRepository(entities.Comment);
		commentRepo.insert(mockComments);
		const voteRepo = getRepository(entities.Vote);
		voteRepo.insert(mockVotes);
	});
