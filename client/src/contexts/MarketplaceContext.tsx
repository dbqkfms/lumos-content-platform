import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { dedupeArtworks, loadManagedArtworks } from "@/lib/artworkData";
import { buildStaticCatalog, loadContentManagerCatalog, normalizeManagedCatalog } from "@/lib/catalog";

// Match the exact interface from standard/localArtworks
export interface Artwork {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    videoSrc?: string;
    displayType: "Horizontal" | "Vertical";
    runtime: string;
    resolution: string;
    tags?: string[];
    worldType?: "standard" | "local"; // to differentiate user uploads if needed
    artist?: string;
    format?: string;
    price?: string;
    titleEn?: string;
    titleKo?: string;
    embedUrl?: string;
    vimeoId?: string;
    line?: "STANDARD" | "LOCAL";
    sourceType?: "static" | "managed" | "content-manager";
    accessTier?: "originals" | "open" | "creator";
    styleCode?: string;
    createdAt?: string;
}

interface MarketplaceState {
    artworks: Artwork[];
    ownedLicenses: Artwork[];
    addArtwork: (artwork: Artwork) => void;
    acquireArtwork: (artwork: Artwork) => void;
}

const staticArtworks: Artwork[] = buildStaticCatalog();

const MarketplaceContext = createContext<MarketplaceState | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dynamicArtworks, setDynamicArtworks] = useState<Artwork[]>([]);
    const [ownedLicenses, setOwnedLicenses] = useState<Artwork[]>([]);

    useEffect(() => {
        let mounted = true;

        Promise.all([loadManagedArtworks(), loadContentManagerCatalog()]).then(([managedItems, contentManagerItems]) => {
            if (!mounted) return;
            setDynamicArtworks(dedupeArtworks([
                ...normalizeManagedCatalog(managedItems),
                ...contentManagerItems,
            ]));
        });

        return () => {
            mounted = false;
        };
    }, []);

    const mergedArtworks = useMemo(
        () => dedupeArtworks([...dynamicArtworks, ...staticArtworks]),
        [dynamicArtworks],
    );

    const addArtwork = (artwork: Artwork) => {
        setDynamicArtworks(prev => dedupeArtworks([artwork, ...prev]));
    };

    const acquireArtwork = (artwork: Artwork) => {
        setOwnedLicenses(prev => {
            // Prevent duplicate licensing
            if (!prev.find(item => item.id === artwork.id)) {
                return [...prev, artwork];
            }
            return prev;
        });
    };

    return (
        <MarketplaceContext.Provider value={{ artworks: mergedArtworks, ownedLicenses, addArtwork, acquireArtwork }}>
            {children}
        </MarketplaceContext.Provider>
    );
};

export const useMarketplace = () => {
    const context = useContext(MarketplaceContext);
    if (context === undefined) {
        throw new Error("useMarketplace must be used within a MarketplaceProvider");
    }
    return context;
};
