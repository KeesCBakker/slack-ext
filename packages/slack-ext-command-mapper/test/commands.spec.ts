import { getDefaultMockedBot } from "./mocks/MockedBot";
const pretend = getDefaultMockedBot();

import { mapper, Options } from "../src";
import { expect } from "chai";
import "mocha";

describe("commands.spec.ts / Default commands", () => {

	beforeEach(() => {
		pretend.start();

		var options = new Options();
		options.verbose = false;

		mapper(
			pretend.robot,
			{
				name: "test",
				commands: [
					{
						name: "dummy",
						invoke: (tool, robot, res) => { }
					}
				]
			},
			options
		);
	});

	afterEach(() => pretend.shutdown());

	it("Invalid command", done => {
		pretend
			.user("kees")
			.send("@hubot test invalid")
			.then(() => {
				var message = pretend.messages[1][1];
				expect(message).to.eq("@kees invalid syntax.");
				done();
			})
			.catch(ex => done(ex));
	});

});
