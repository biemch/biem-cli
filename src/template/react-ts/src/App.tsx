import './App.scss';

import { useTemplateValue } from '@biem/template-utils';

import Biem from './asset/img/biem.svg?react';
import { Values } from './types';

export default function App() {
	const values = useTemplateValue<Values>();

	return (
		<>

			<div className="absolute inset-0">
				<img src={values.image} alt={values.headline} className="size-full rounded-lg border border-white/20 object-cover opacity-10" />
			</div>

			<div className="relative z-10 mx-auto flex size-full max-w-screen-sm flex-col items-start justify-center space-y-8">
				<Biem className="size-32" />
				<div className="space-y-4">
					<h1 className="text-3xl font-bold">{values.headline}</h1>
					<div
						className="text-xl opacity-60"
						dangerouslySetInnerHTML={{
							__html: values.paragraph,
						}}
					/>
				</div>
				<div className="grid grid-cols-2 gap-8">
					{values.features.map((feature, index) => (
						<div key={index} className="space-y-2">
							<h2 className="text-lg font-bold">{feature.title}</h2>
							<p className="opacity-60">{feature.value}</p>
						</div>
					))}
				</div>

			</div>
		</>
	);
}
