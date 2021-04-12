import "reflect-metadata";
import { FieldConfig } from "./FieldConfig";
export declare function editable(target: any, propertyKey: string): void;
export declare function field(config: Partial<FieldConfig>): (target: any, propertyKey: string) => void;
