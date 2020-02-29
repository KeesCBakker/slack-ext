import { IParameter, ITool } from "../src";
import { convertCommandIntoRegexString } from "../src/utils/regex";

export function test(regex: string, dataToTest: string) {
	var r = new RegExp(regex, "i");
	return r.test(dataToTest);
}

export function createRegex(
	parameters: IParameter[],
	toolName = "test",
	commandName = "cmd"
) {
	let tool: ITool = {
		name: toolName,
		commands: [
			{
				name: commandName,
				parameters: parameters,
				invoke: () => { }
			}
		]
	};

	return convertCommandIntoRegexString(
		tool, tool.commands[0]);
}

export function delay<T>(ms: number, val: T) {
	return new Promise<T>(r => {
		setTimeout(() => {
			r(val);
		}, ms);
	});
}
