import { Robot } from './robot/Robot';
import { map_command as _map_command } from "./mappers/map_command";
import { map_tool as _map_tool } from "./mappers/map_tool";
import { defaultOptions, Options, IOptions } from "./entities/options";
import { NumberParameter } from "./entities/parameters/NumberParameter";
import { NumberStyle } from "./entities/parameters/NumberStyle";
import { FractionParameter } from "./entities/parameters/FractionParameter";
import { FractionStyle } from "./entities/parameters/FractionStyle";
import { RestParameter } from "./entities/parameters/RestParameter";
import { AnyParameter } from "./entities/parameters/AnyParameter";
import { StringParameter } from "./entities/parameters/StringParameter";
import { ChoiceParameter } from "./entities/parameters/ChoiceParameter";
import { RegExStringParameter } from "./entities/parameters/RegExStringParameter";
import { TokenParameter } from "./entities/parameters/TokenParameter";
import { IPv4Parameter } from "./entities/parameters/IPv4Parameter";
import { IParameter, ITool, ICommand, ICallback, ICommandResolverResultDebugInfo, IRobot, IMap, IResponseContext } from './definitions';

export {
	IParameter,
	NumberParameter,
	NumberStyle,
	FractionParameter,
	FractionStyle,
	RestParameter,
	AnyParameter,
	StringParameter,
	ChoiceParameter,
	RegExStringParameter,
	TokenParameter,
	IPv4Parameter,
	IOptions,
	Options,
	defaultOptions,
	ITool,
	ICommand,
	ICallback,
	IResponseContext,
	ICommandResolverResultDebugInfo
}

//needed for reload - otherwise the caller value will be cached
const caller = module.parent;
delete require.cache[__filename];

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
export function mapper(
	robot: IRobot,
	tool: ITool,
	options: IOptions = defaultOptions
) {
	_map_tool(robot, tool, options);
}

/**
 * Creates a mapping for a single command.
 *
 * @export
 * @param {IRobot} robot The robot.
 * @param {string} command The command.
 * @param {(...(IParameter | ICallback | IOptions)[])} args You can specify parameters, the callback and options here.
 */
export function map_command(
	robot: IRobot,
	command: string,
	...args: (IParameter | ICallback | IOptions)[]
): void {
	_map_command(robot, command, args);
}

/**
 * Maps the specified tool to the Robot.
 *
 * @param robot The robot.
 * @param tool The tool.
 * @param options The options.
 */
export function map_tool(
	robot: IRobot,
	tool: ITool,
	options: IOptions = defaultOptions
) {
	mapper(robot, tool, options);
}

/**
 * Maps a list of alias commands to the Robot.
 *
 * @export
 * @param {IRobot} robot The robot.
 * @param {*} map An object with keys and redirects.
 * @param {IOptions} [options=defaultOptions] The options.
 */
export function alias(
	robot: IRobot,
	map: IMap<string>,
	options: IOptions = defaultOptions
) {

	if (!robot) throw "Argument 'robot' is empty.";
	if (!map) throw "Argument 'map' is empty.";

	Object.keys(map).forEach(key => {

		if (options && options.verbose) {
			console.log(`Aliasing '${key}' to '${map[key]}'.`)
		}

		let registrationKey = key;
		if (key.endsWith("*")) {
			registrationKey = key.substr(0, key.length - 1);
		}

		robot.registerAlias(registrationKey, map[key]);
	});
}

export function map_default_alias(
	robot: IRobot,
	destination: string,
	options: IOptions = defaultOptions
) {
	if (!robot) throw "Argument 'robot' is empty.";

	if (options && options.verbose) {
		console.log(`Aliasing default to ${destination}.`)
	}

	robot.registerAlias("", destination);
}


export {
	IRobot,
	Robot
}
