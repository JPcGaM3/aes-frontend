import React from "react";
import { Autocomplete, AutocompleteProps } from "@heroui/react";

interface ExtendedClassNames {
	base?: string;
	listboxWrapper?: string;
	listbox?: string;
	popoverContent?: string;
	endContentWrapper?: string;
	clearButton?: string;
	selectorButton?: string;
	label?: string;
	mainWrapper?: string;
	inputWrapper?: string;
	innerWrapper?: string;
	input?: string;
	helperWrapper?: string;
	description?: string;
	errorMessage?: string;
}

interface PatchedAutocompleteProps<T extends object>
	extends Omit<AutocompleteProps<T>, "classNames"> {
	classNames?: ExtendedClassNames;
}

/**
 * PatchedAutocomplete - A wrapper around HeroUI's Autocomplete that supports additional classNames
 * including Input component slots like 'label' and 'mainWrapper' that are not exposed
 * in the original Autocomplete component.
 */
export const PatchedAutocomplete = <T extends object>({
	classNames,
	inputProps,
	...props
}: PatchedAutocompleteProps<T>) => {
	const {
		label,
		mainWrapper,
		inputWrapper,
		innerWrapper,
		input,
		helperWrapper,
		description,
		errorMessage,
		...autocompleteClassNames
	} = classNames || {};

	const enhancedInputProps = {
		...inputProps,
		classNames: {
			...inputProps?.classNames,
			...(label && { label }),
			...(mainWrapper && { mainWrapper }),
			...(inputWrapper && { inputWrapper }),
			...(innerWrapper && { innerWrapper }),
			...(input && { input }),
			...(helperWrapper && { helperWrapper }),
			...(description && { description }),
			...(errorMessage && { errorMessage }),
		},
	};

	return (
		<Autocomplete
			{...props}
			classNames={autocompleteClassNames}
			inputProps={enhancedInputProps}
		/>
	);
};

PatchedAutocomplete.displayName = "PatchedAutocomplete";

export default PatchedAutocomplete;
