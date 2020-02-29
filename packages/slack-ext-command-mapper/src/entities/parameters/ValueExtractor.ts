import { convertCommandIntoRegexString } from "../../utils/regex";
import { isUndefined } from "util";
import { IParameterValueCollection, ICommand, ITool, IMap } from "../../definitions";

const NamedRegExp = require("named-regexp-groups");

export function getValues(tool: ITool, command: ICommand, messsage: string): IParameterValueCollection {
	let collection: IMap<string> = {};

	if (command.parameters) {
		let r = convertCommandIntoRegexString(tool, command, true);
		let nr = new NamedRegExp(r, "i");

		let answer = nr.exec(messsage).groups;

		for (let parameter of command.parameters) {
			let value = answer[parameter.name];
			if (isUndefined(value)) {
				value = parameter.defaultValue;
			}
			collection[parameter.name] = value;
		}
	}

	return collection as IParameterValueCollection;
}
