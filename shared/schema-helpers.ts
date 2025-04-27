// This file provides stub implementations for schema helpers used in schema.ts.
// Replace these with real implementations from your ORM or database layer as needed.
export function pgTable(name: string, schema: any) { return { name, schema }; }
export function serial(name: string) { return { name, type: 'serial', primaryKey: () => ({}) }; }
export function integer(name: string) { return { name, type: 'integer', notNull: () => ({ references: () => ({}) }) }; }
export function text(name: string) { return { name, type: 'text', notNull: () => ({ default: () => ({}) }) }; }
export function real(name: string) { return { name, type: 'real', notNull: () => ({ default: () => ({}) }) }; }
export function boolean(name: string) { return { name, type: 'boolean', notNull: () => ({ default: () => ({}) }) }; }
export function timestamp(name: string) { return { name, type: 'timestamp', notNull: () => ({ defaultNow: () => ({}) }) }; }
export function jsonb(name: string) { return { name, type: 'jsonb', notNull: () => ({ default: () => ({}) }) }; }
export function relations(table: any, fn: any) { return fn({ one, many }); }
export function one(table: any, opts: any) { return { table, ...opts }; }
export function many(table: any) { return { table }; }
