// The prototype's growth icons for the five stages (seed → bloom), plus two in the same style for Recap and Missions.
export function StageIcon({ i, bg, ring, fg, size = 24 }: { i: number; bg: string; ring: string; fg: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: 'none' }}>
      <circle cx="12" cy="12" r="11" fill={bg} stroke={ring} strokeWidth="1.5"></circle>
      {i === 0 && <ellipse cx="12" cy="14" rx="4" ry="5.2" transform="rotate(-20 12 14)" fill={fg}></ellipse>}
      {i === 1 && <><path d="M12 18 V 11" stroke={fg} strokeWidth="1.8" strokeLinecap="round"></path><path d="M12 12 C 8 12, 6.5 9, 7 7 C 10 7, 12 9, 12 12 Z" fill={fg}></path></>}
      {i === 2 && <><path d="M12 18.5 V 8" stroke={fg} strokeWidth="1.8" strokeLinecap="round"></path><path d="M12 13 C 8 13, 6 10, 6.5 8 C 9.5 8, 12 10, 12 13 Z M12 11 C 15.5 11, 17.5 8, 17 6 C 14 6, 12 8, 12 11 Z" fill={fg}></path></>}
      {i === 3 && <><path d="M12 19 V 12" stroke={fg} strokeWidth="1.8" strokeLinecap="round"></path><path d="M12 13 C 9 12, 8.5 8, 12 5 C 15.5 8, 15 12, 12 13 Z" fill={fg}></path></>}
      {i === 4 && <><circle cx="12" cy="7.2" r="2.6" fill={fg}></circle><circle cx="16.6" cy="10.6" r="2.6" fill={fg}></circle><circle cx="14.8" cy="16" r="2.6" fill={fg}></circle><circle cx="9.2" cy="16" r="2.6" fill={fg}></circle><circle cx="7.4" cy="10.6" r="2.6" fill={fg}></circle><circle cx="12" cy="12" r="2" fill={bg}></circle></>}
      {/* recap: a specimen tag with notes */}
      {i === 5 && <><path d="M9.5 6.5 H 17 V 17.5 H 9.5 L 6.5 12 Z" fill="none" stroke={fg} strokeWidth="1.7" strokeLinejoin="round"></path><path d="M11.5 10.2 H 15 M11.5 13.8 H 15" stroke={fg} strokeWidth="1.5" strokeLinecap="round"></path></>}
      {/* missions: a compass needle */}
      {i === 6 && <><path d="M12 12 L 16 6.5 L 13.4 13.4 Z" fill={fg}></path><path d="M12 12 L 8 17.5 L 10.6 10.6 Z" fill={fg} opacity="0.65"></path><circle cx="12" cy="12" r="1.3" fill={bg}></circle></>}
    </svg>
  );
}
