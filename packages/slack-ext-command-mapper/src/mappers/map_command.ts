import { IOptions, defaultOptions } from "../entities/options";
import { map_tool } from "./map_tool";
import { IRobot, IParameter, ICallback, ITool, IResponse, IParameterValueCollection, IResponseContext } from "../definitions";

export function map_command(
	robot: IRobot,
	command: string,
	args: (IParameter | ICallback | IOptions)[]
): void {

	let callback = args.find(a => a instanceof Function) as ICallback;
	if (!callback) throw "Missing callback function.";

	let parameters = args.filter(a => (a as IParameter).name) as IParameter[];
	let options =
		(args.find(
			a =>
				typeof (a as IOptions).verbose !== 'undefined'
		) as IOptions) || defaultOptions;

	let tool = {
		name: command,
		commands: [
			{
				name: 'cmd',
				parameters: parameters,
				alias: [''],
				invoke: (
					tool: ITool,
					robot: IRobot,
					res: IResponse,
					match: RegExpMatchArray,
					values: IParameterValueCollection
				) => {

					var context = {
						tool: tool,
						robot: robot,
						res: res,
						match: match,
						values: values
					} as IResponseContext;

					callback(context);
				}
			}
		]
	} as ITool;

	map_tool(robot, tool, options);
}
