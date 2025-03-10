import React, { useEffect } from 'react';
import { useBox } from '@react-three/cannon';
import { ITextConfig } from './Canvas';
import { useFrame } from '@react-three/fiber';
import * as Three from 'three';
import { MathUtils } from 'three';
import Phase from '../Phase';

interface IProps {
	config: ITextConfig | undefined;
	value: string;
	position: number[];
	color?: string;
	phase: number;
}

export default function Character({ config, value, position, color = 'black', phase }: IProps) {
	const [ref, api] = useBox(() => ({
		mass: 1,
		// @ts-ignore
		position: position,
		args: [0.06, 0.06, 0.06],
	}));
	useEffect(() => {
		switch (phase) {
			case Phase.initial:
				api.mass?.set(0);
				break;
			case Phase.warpToCamPos2:
				setTimeout(() => {
					api.mass?.set(1);
				}, MathUtils.randFloat(1500, 5000));
				break;
			case Phase.warp1Complete:
				setTimeout(() => {
					const randomNum = MathUtils.randFloat(40, 70);
					api.applyForce([MathUtils.randFloat(-20, 20), randomNum, randomNum], [0, 0, 0]);
					api.angularFactor.set(randomNum / 100, 1, 1);
				}, MathUtils.randFloat(300, 5000));
				break;
		}
	}, [phase]);
	useFrame(() => {});
	return (
		<>
			{config && (
				<mesh ref={ref} scale={0.9}>
					<textGeometry args={[value, config]} />
					<meshPhysicalMaterial color={color} roughness={0.4} reflectivity={0.4} metalness={0.7} />
				</mesh>
			)}
		</>
	);
}
