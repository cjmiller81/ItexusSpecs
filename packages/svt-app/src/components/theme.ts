import { extendTheme } from "@chakra-ui/react"

export default extendTheme({
	colors: {
		positive: "#44df8f",
		negative: "#ea5f3d"
	},
	components: {
		Button: {
			baseStyle: {
				backgroundColor: "#116DFD",
				textTransform: "uppercase",
				fontWeight: "bold",
				borderRadius: "0px"
			},
		},

		FormLabel: {
			baseStyle: {
				textTransform: "uppercase",
				fontSize: "12px",
				fontWeight: 700,
				lineHeight: "16px",
				color: "#555689",
				marginRight: "0px",
				marginBottom: "8px"
			},

		},
		FormControl: {
			parts: ['container'],
			baseStyle: {
				container: {
					borderColor: "#203864"
				}
			}
		},
		Input: {
			parts: ['field', 'addon'],
			baseStyle: {
				field: {
					borderRadius: "0px",
					borderWidth: "1px",
					borderColor: "#203864",
					color: "white",
					pl: "18px",
					pr: "2px !important",
					"::-webkit-calendar-picker-indicator": {
						filter: "invert(1)",
						transform: "translateX(-24px)"
					},

				}
			},
			variants: {
				outline: {
					field: {
						borderRadius: "0px",
						borderWidth: "2px !important",
						borderColor: "#203864 !important",
						color: "white",
						px: "16px",
						fontSize: "15px",
						lineHeight: "17px",
						"::-webkit-calendar-picker-indicator": {
							display: "none",
							filter: "invert(1)",
							transform: "translateX(6px)"
						},
						_focus: {
							boxShadow: "none",
							borderColor: "#116DFD !important"
						},
					}
				},
				unstyled: {
					field: {
						outline: "none !important",
						border: "none !important",
						fontSize: "15px",
						lineHeight: "17px",
						minH: "35px",
						backgroundColor: "transparent !important",
						pl: "0px !important"
					}
				}
			}
		},
		NumberInput: {
			parts: ['field', 'stepper'],
			baseStyle: {
				field: {
					borderRadius: "0px",
					borderWidth: "1px",
					borderColor: "#203864",
					color: "white",
					pl: "18px",
					pr: "2px !important",
				}
			},
			variants: {
				outline: {
					field: {
						borderRadius: "0px",
						borderWidth: "2px !important",
						borderColor: "#203864 !important",
						color: "white",
						px: "16px",
						fontSize: "15px",
						lineHeight: "17px",
						_focus: {
							boxShadow: "none",
							borderColor: "#116DFD !important"
						},
					},
					stepper: {
						borderColor: "#203864 !important"
					}
				},
				unstyled: {
					field: {
						border: "none !important",
						backgroundColor: "transparent !important",
						paddingLeft: "0px !important",
						fontSize: "13px !important",
						lineHeight: "13px !important"
					}
				}
			}
		},
		Select: {
			parts: ["field", "icon"],
			baseStyle: {
				field: {},
				icon: {}
			},
			variants: {
				unstyled: {
					field: {
						borderWidth: "0px",
						borderColor: "none",
						fontSize: "13px",
						lineHeight: "13px",
						fontWeight: "500",
						pr: "0px",
					},
				}
			}
		},
		Table: {
			parts: ['table', 'th', 'td'],
			variants: {
				positions: {
					th: {
						textTransform: "uppercase",
						color: "#555689",
						fontSize: "12px",
						fontFamily: "body"
					},
					td: {
						borderTopColor: "#151d31",
						borderBottomColor: "#151d31",
						borderTopWidth: "8px",
						borderBottomWidth: "0px",
						paddingY: "4px",
						backgroundColor: "#1d2538"
					}
				}
			}
		},
		Tabs: {
			parts: ['root', 'tab', 'tablist', 'tabpanel'],
			baseStyle: {
				root: {
					borderBottomColor: "#0f2244",
					color: "white"
				},
				tab: {
					textTransform: "uppercase",
					_selected: {
						color: "white !important"
					}
				},
			},
			variants: {},
		},
	},
	fonts: {
		body: "Ubuntu"
	},
	layerStyles: {
		card: {
			boxShadow: "3px 3px 29px 0px rgb(0 0 0 / 10%)",
			borderWidth: "1px",
			borderColor: "rgb(221,221,221)",
			backgroundColor: "white",
		},
		callout: {
			fontSize: "25px",
			lineHeight: "29px",
			fontWeight: 700,
			textAlign: "left"
		},
		positionPillStart: {
			// maxH: "25px",
			fontSize: "13px",
			lineHeight: "13px",
			borderTopLeftRadius: "12px",
			borderBottomLeftRadius: "12px",
			borderWidth: "2px",
			borderColor: "#4E91F8",
			borderRightWidth: "0px",
			pl: "16px",
			pr: "0px",
			py: "3px",
		},
		positionPillMiddle: {
			// maxH: "25px",
			fontSize: "13px",
			fontWeight: "500",
			lineHeight: "13px",
			borderWidth: "2px",
			borderRightWidth: "0px",
			borderLeftWidth: "0px",
			borderColor: "#4E91F8",
			px: "3",
			py: "3px",
		},
		positionPillEnd: {
			fontSize: "13px",
			lineHeight: "13px",
			borderTopRightRadius: "12px",
			borderBottomRightRadius: "12px",
			borderWidth: "2px",
			borderColor: "#4E91F8",
			borderLeftWidth: "0px",
			pl: "0px",
			pr: "16px",
			py: "3px",
		}
	},
	textStyles: {
		eyebrow: {
			color: "#555689",
			textTransform: "uppercase",
			fontSize: "13px",
			lineHeight: "17px",
			fontWeight: 700
		},
		math: {
			color: "rgba(20,39,47,.33)",
			fontSize: "32px",
			lineHeight: "32px",
			fontWeight: 500,
		},
		stat: {
			fontSize: "25px",
			lineHeight: "29px",
			fontWeight: 700
		}
	},
})
