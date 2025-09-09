import { useEffect, useRef } from "react";

type Listener<T> = (data: T, event: MessageEvent) => void;

type EventHandlers<T> = Record<string, Listener<T>>;

export const useEventSource = <T>({
	onOpen,
	onError,
	events,
	src,
}: {
	src: string;
	onOpen?: () => void;
	onError?: () => void;
	events: EventHandlers<T>;
}) => {
	const eventSourceRef = useRef<EventSource>(null);
	const onOpenRef = useRef(onOpen);
	const onErrorRef = useRef(onError);
	const eventsRef = useRef(events);

	useEffect(() => {
		onOpenRef.current = onOpen;
	}, [onOpen]);

	useEffect(() => {
		onErrorRef.current = onError;
	}, [onError]);

	useEffect(() => {
		eventsRef.current = events;
	}, [events]);

	useEffect(() => {
		const eventSource = new EventSource(src);
		console.log("sse connected");
		eventSourceRef.current = eventSource;

		const controller = new AbortController();

		eventSource.addEventListener(
			"open",
			() => {
				console.log("sse connection opened");
				onOpenRef.current?.();
			},
			{
				signal: controller.signal,
			},
		);

		eventSource.addEventListener(
			"error",
			(event) => {
				console.error("sse connection error", event);
				onErrorRef.current?.();
			},
			{
				signal: controller.signal,
			},
		);

		// Default `message` event listener
		eventSource.addEventListener(
			"message",
			(event) => {
				const data = parseMessage<T>(event.data);
				eventsRef.current?.message(data as T, event);
			},
			{
				signal: controller.signal,
			},
		);

		for (const event of eventsRef.current
			? Object.keys(eventsRef.current)
			: []) {
			if (event === "message") continue;

			const fn = (ev: MessageEvent) =>
				eventsRef.current[event](parseMessage<T>(ev.data) as T, ev);
			eventSource.addEventListener(event, fn, { signal: controller.signal });
		}

		function parseMessage<T>(text: string): T | string {
			try {
				return JSON.parse(text) as T;
			} catch {
				return text;
			}
		}
		return () => {
			eventSource.close();
		};
	}, [src]);

	return {
		eventSource: eventSourceRef.current,
		close: () => eventSourceRef.current?.close(),
	};
};
