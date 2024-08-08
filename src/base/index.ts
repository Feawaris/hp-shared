// 基础模块。有同名原生对象的加 _ 区分
export * from './node'; // node 概念增加 import { xx } from 'hp-shared/base.node' 方式使用
export * from './base';

export * from './_Array';
export * from './_BigInt';
export * from './_console';
export * from './_Date';
export * from './_Function';
export * from './_JSON';
export * from './_Math';
export * from './_Number';
export * from './_Object';
export * from './_Proxy';
export * from './_Reflect';
export * from './_Set';
export * from './_String';

export * from './Data';
