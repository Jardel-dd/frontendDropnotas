"use client";

import { CSSProperties, ReactNode } from "react";
import { Card } from "primereact/card";
import styles from "./SectionCard.module.css";

interface SectionCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
  collapsible?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}

export function SectionCard({
  icon,
  title,
  children,
  className = "",
  collapsible = false,
  expanded = true,
  onToggle
}: SectionCardProps) {
  const headerMain = (
    <div className={styles.headerMain}>
      <span className={styles.iconWrap} aria-hidden="true">
        {icon}
      </span>
      <h3 className={styles.title}>{title}</h3>
    </div>
  );

  const header = collapsible ? (
    <button
      type="button"
      className={`${styles.headerButton} ${expanded ? styles.headerButtonExpanded : styles.headerButtonCollapsed}`}
      onClick={onToggle}
      aria-expanded={expanded}
    >
      {headerMain}
      <span
        className={`${styles.chevron} ${!expanded ? styles.chevronCollapsed : ""}`}
        aria-hidden="true"
      >
        <i className="pi pi-chevron-down" />
      </span>
    </button>
  ) : (
    <div className={styles.header}>{headerMain}</div>
  );

  return (
    <Card
      className={`${styles.card} ${className} ${collapsible ? styles.cardCollapsible : ""} ${expanded ? styles.cardExpanded : styles.cardCollapsed}`}
      header={header}
      pt={{ body: { style: { padding: 0 } }, content: { style: { padding: 0 } } }}
    >
      <div className={`${styles.content} ${expanded ? styles.contentExpanded : ""} ${collapsible && !expanded ? styles.contentCollapsed : ""}`}>
        {children}
      </div>
    </Card>
  );
}

interface SectionGridProps {
  children: ReactNode;
  minColumnWidth?: string;
}

export function SectionGrid({ children, minColumnWidth = "210px" }: SectionGridProps) {
  return (
    <div
      className={styles.grid}
      style={{ "--min-col": minColumnWidth } as CSSProperties}
    >
      {children}
    </div>
  );
}
