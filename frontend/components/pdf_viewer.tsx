"use client";
import React, { useState, useCallback } from "react";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfViewer = ({ path }: { path: string }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [currentPage, setCurrentPage] = useState<number>(1); // State to keep track of current page

    return (
        <div>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={path}
                    onDocumentLoad={() => {}}

                />
            </Worker>
        </div>
    );
};

export default PdfViewer;
