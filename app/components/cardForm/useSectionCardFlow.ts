'use client';

import { useCallback, useMemo, useState } from 'react';

export interface SectionCardFlowConfig {
    id: string;
    errorFields?: string[];
}

type ErrorsMap = Record<string, string>;

interface UseSectionCardFlowParams {
    sections: SectionCardFlowConfig[];
    initialExpandedId?: string | null;
}

export function useSectionCardFlow({
    sections,
    initialExpandedId
}: UseSectionCardFlowParams) {
    const defaultExpandedId = initialExpandedId ?? sections[0]?.id ?? null;
    const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>(
        defaultExpandedId ? [defaultExpandedId] : []
    );

    const errorFieldToSectionMap = useMemo(() => {
        const map = new Map<string, string>();

        sections.forEach((section) => {
            section.errorFields?.forEach((field) => {
                map.set(field, section.id);
            });
        });

        return map;
    }, [sections]);

    const isSectionExpanded = useCallback(
        (sectionId: string) => expandedSectionIds.includes(sectionId),
        [expandedSectionIds]
    );

    const toggleSection = useCallback((sectionId: string) => {
        setExpandedSectionIds((current) =>
            current.includes(sectionId)
                ? current.filter((id) => id !== sectionId)
                : [...current, sectionId]
        );
    }, []);

    const openSection = useCallback((sectionId?: string | null) => {
        if (!sectionId) {
            return;
        }

        setExpandedSectionIds((current) =>
            current.includes(sectionId) ? current : [...current, sectionId]
        );
    }, []);

    const findSectionByErrorKey = useCallback(
        (errorKey?: string | null) => {
            if (!errorKey) {
                return null;
            }

            return errorFieldToSectionMap.get(errorKey) ?? null;
        },
        [errorFieldToSectionMap]
    );

    const syncExpandedSectionWithErrors = useCallback(
        (errors?: ErrorsMap | null) => {
            const firstErrorKey = errors ? Object.keys(errors)[0] : null;
            const relatedSectionId = findSectionByErrorKey(firstErrorKey);

            if (relatedSectionId) {
                setExpandedSectionIds((current) =>
                    current.includes(relatedSectionId) ? current : [...current, relatedSectionId]
                );
            }
        },
        [findSectionByErrorKey]
    );

    return {
        expandedSectionIds,
        isSectionExpanded,
        toggleSection,
        openSection,
        findSectionByErrorKey,
        syncExpandedSectionWithErrors
    };
}
