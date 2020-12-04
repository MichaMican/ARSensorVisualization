export class FilterToggleEvent extends Event {
	static readonly EVENT_NAME = 'filtertoggle'

	constructor(readonly filterEnabled: boolean) {
		super(FilterToggleEvent.EVENT_NAME)
	}
}

export class FilterBoxToggleEvent extends Event {
	static readonly EVENT_NAME = 'filterboxtoggle'

	constructor(readonly filterBoxEnabled: boolean) {
		super(FilterBoxToggleEvent.EVENT_NAME)
	}
}

export class FilterChangeEvent extends Event {
	static readonly EVENT_NAME = 'filterchange'

	constructor() {
		super(FilterChangeEvent.EVENT_NAME)
	}
}

export interface GuiEventMap {
	[FilterToggleEvent.EVENT_NAME]: FilterToggleEvent
	[FilterBoxToggleEvent.EVENT_NAME]: FilterBoxToggleEvent
	[FilterChangeEvent.EVENT_NAME]: FilterChangeEvent
}
