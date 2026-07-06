<script setup lang="ts">
	import { computed, onBeforeUnmount, ref } from 'vue';
	import { A2Surface, useA2UI } from '@a2ui-vue3-elementplus/element-plus';

	type SurfaceSummary = {
		id?: string;
		surfaceId?: string;
	};

	const fixtureModules = import.meta.glob<string>('../../../fixtures/**/*.jsonl', {
		eager: true,
		import: 'default',
		query: '?raw',
	});

	function titleCaseSegment(segment: string) {
		return segment
			.split('-')
			.filter(Boolean)
			.map(part => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');
	}

	function fileFixtureName(path: string) {
		const fileName = path.split('/').pop()?.replace(/\.jsonl$/, '') ?? path;
		return titleCaseSegment(fileName);
	}

	function scopedFixtureName(path: string) {
		return path
			.replace(/^.*fixtures\//, '')
			.replace(/\.jsonl$/, '')
			.split('/')
			.map(titleCaseSegment)
			.join(' / ');
	}

	const fixtureItems = Object.entries(fixtureModules).sort(([left], [right]) => left.localeCompare(right));
	const duplicateNames = new Set(
		fixtureItems
			.map(([path]) => fileFixtureName(path))
			.filter((name, index, names) => names.indexOf(name) !== index),
	);

	const fixtures = Object.fromEntries(
		fixtureItems.map(([path, content]) => [
			duplicateNames.has(fileFixtureName(path)) ? scopedFixtureName(path) : fileFixtureName(path),
			content,
		]),
	);

	const selectedFixture = ref('Basic Form');
	const source = ref(fixtures[selectedFixture.value] ?? '');
	const logs = ref<string[]>([]);
	const cursor = ref(0);
	const surfaceIds = ref<string[]>([]);

	const { runtime, pushMessage, pushChunk } = useA2UI({
		components: {
			MetricCard: {
				propsMapper: (node, ctx) => ({
					title: node.title,
					value: ctx.resolveValue(node.value),
					tone: node.tone,
				}),
				component: {
					props: ['title', 'value', 'tone'],
					template: '<div class="metric-card" :data-tone="tone"><span>{{ title }}</span><strong>{{ value }}</strong></div>',
				},
			},
		},
		onAction(action) {
			logs.value.unshift(JSON.stringify(action, null, 2));
		},
		onError(error) {
			logs.value.unshift(`ERROR: ${String(error)}`);
		},
	});

	function syncSurfaceIds() {
		surfaceIds.value = runtime.store
			.listSurfaces()
			.map((surface: SurfaceSummary) => surface.surfaceId ?? surface.id)
			.filter((surfaceId: string | undefined): surfaceId is string => Boolean(surfaceId));
	}

	const unsubscribeSurfaceSync = runtime.subscribe?.(syncSurfaceIds);
	syncSurfaceIds();

	onBeforeUnmount(() => {
		unsubscribeSurfaceSync?.();
	});

	const lines = computed(() => source.value.split(/\r?\n/).filter(line => line.trim().length > 0));

	function loadFixture() {
		source.value = fixtures[selectedFixture.value];
		reset();
	}

	function reset() {
		runtime.reset?.();
		cursor.value = 0;
		logs.value = [];
	}

	function playAll() {
		reset();
		pushChunk(source.value);
		cursor.value = lines.value.length;
	}

	function step() {
		const line = lines.value[cursor.value];
		if (!line) {
			return;
		}
		pushMessage(line);
		cursor.value += 1;
	}
</script>

<template>
	<main class="playground">
		<section class="toolbar">
			<h1>A2UI Playground</h1>
			<div class="toolbar__actions">
				<select v-model="selectedFixture" @change="loadFixture">
					<option v-for="(_, name) in fixtures" :key="name" :value="name">{{ name }}</option>
				</select>
				<button type="button" @click="step">Step</button>
				<button type="button" @click="playAll">Play All</button>
				<button type="button" @click="reset">Reset</button>
			</div>
		</section>

		<section class="workspace">
			<div class="editor-pane">
				<textarea v-model="source" spellcheck="false" />
			</div>

			<div class="render-pane">
				<A2Surface
					v-for="surfaceId in surfaceIds"
					:key="surfaceId"
					:runtime="runtime"
					:surface-id="surfaceId"
				/>
			</div>

			<aside class="inspect-pane">
				<h2>Action Log</h2>
				<pre v-for="(log, index) in logs" :key="index">{{ log }}</pre>
			</aside>
		</section>
	</main>
</template>
