export class Status {
	public value: number;
	public message: String = "";

	public valueOf = (): number => { return this.value };

	constructor(value: number, message: String = "") {
		this.value = value;
		this.message = message;
	}
}
