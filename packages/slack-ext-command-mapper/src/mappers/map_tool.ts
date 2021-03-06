import { IOptions, defaultOptions } from "../entities/options";
import { convertCommandIntoRegexString, convertToolIntoRegexString } from "../utils/regex";
import validateTool from "./validation";
import { CommandResolver } from "../entities/CommandResolver";
import { IRobot, ITool } from "../definitions";

/**
 * Maps the specified tool to the Robot.
 *
 * @export
 * @param {NodeModule} caller The caller.
 * @param {NodeModule} packageModule The package module.
 * @param {IRobot} robot The robot.
 * @param {ITool} tool The tool that will be mapped.
 * @param {IOptions} [options] The options for this specific mapping.
 */
export function map_tool(
	robot: IRobot,
	tool: ITool,
	options: IOptions = defaultOptions
) {
	if (!robot) throw "Argument 'robot' is empty.";
	if (!tool) throw "Argument 'tool' is empty.";
	if (!tool.commands) tool.commands = [];

	validateTool(tool);

	//init every command
	tool.commands.forEach(cmd => {

		//use a second validation regex to confirm the message we
		//are responding to, is as we expected. This will prevent command
		//match edge cases in which certain phrases end with a command name
		const strValidationRegex = convertCommandIntoRegexString(
			tool,
			cmd
		);

		cmd.validationRegex = new RegExp(strValidationRegex, "i");

		if (options.verbose) {
			console.log(
				`Mapping '${tool.name}.${cmd.name}' as '${strValidationRegex}'.`
			);
		}

	});

	//listen for invocation of tool
	const toolRegexString = convertToolIntoRegexString(tool);
	const toolRegex = new RegExp(toolRegexString, "i");
	const resolver = new CommandResolver();

	robot.respond(toolRegex, res => {

		var action = resolver.resolveFromTool(tool, res);
		if (!action || !action.tool) {
			return;
		}

		//if no commands matched, show help command
		if (action.command == null) {
			if (options.showInvalidSyntax) {
				res.reply(options.invalidSyntaxMessage);
			}
			return;
		}

		if (options.verbose) {
			action.log();
		}

		if (!action.authorized) {
			res.reply(options.notAuthorizedMessage);
			return;
		}

		if (action.command.invoke) {
			action.command.invoke(tool, robot, res, action.match, action.values);
		}
		else if (action.command.execute) {
			action.command.execute({
				tool: tool,
				robot: robot,
				res: res,
				match: action.match,
				values: action.values
			});
		}
	});
}
